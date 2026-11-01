/*
name: Core Tasks
description: Background tasks for scripts: C#'s Task.Run and new Thread, run as generator functions between the script's bot calls.
tags: core, tasks, library
*/
// Turu: C# scripts run work beside the main loop with `Task.Run(async () => ...)` or `new Thread(...)`
// (the Ultras' skill loop, taunt pulses, walks started from packet listeners). Turu scripts run on one
// thread, so a task here is a generator function that a `bot.handlers` timer steps between the
// script's bot calls and during `bot.sleep`. VibeSkua sends every Flash call to the UI thread one at a
// time anyway, so a C# task never touched the game in parallel either; what it bought was not waiting.
//
// Porting a task:
//
//     _ = Task.Run(async () => {           tasks.start("walk", function* () {
//         Bot.Player.WalkTo(x, y);             bot.player.walkTo(x, y);
//         Bot.Wait.ForTrue(() => near, 10);    yield until(() => near, 10);
//         await Task.Delay(2000);              yield 2000;
//     }, cts.Token);                       });
//     cts.Cancel();                        tasks.cancel("walk");
//     task is { IsCompleted: false }       tasks.running("walk")
//
// Inside a task, wait with `yield` and not with `bot.sleep` or `bot.wait.*`: those block the whole
// script, this task's siblings too (handlers never run inside a handler). A task runs until its
// generator returns, it's cancelled, or it throws (the error is logged, as a faulted C# task is lost).
// Cancelling runs the generator's `finally` blocks (C#'s `catch (OperationCanceledException)`).
// Stop ends every task with the script.

import { bot } from "turu";
import { rethrowIfStopped } from "./CoreBots";

/** Name of the `bot.handlers` timer that steps the tasks. */
const HANDLER = "CoreTasks";
/** How often the timer runs (VibeSkua's handler timer runs every 20 ms too). */
const TICK_MS = 20;

/** What a task yields: a delay in ms, a condition from {@link until}, or nothing (the next tick). */
export type TaskStep = number | Until | void;

/** A task's body. Each `yield` receives true, or for {@link until} whether the condition came true. */
export type TaskBody = () => Generator<TaskStep, unknown, boolean>;

/** A condition a task waits for, made by {@link until}. */
export interface Until {
    readonly condition: () => boolean;
    /** Tries of `interval` ms, as `bot.wait.forTrue` counts them; 0 or less waits forever. */
    readonly timeout: number;
    readonly interval: number;
}

/**
 * `yield until(condition, timeout)` waits until `condition` is true, like `bot.wait.forTrue`:
 * `timeout` counts tries of `interval` ms (10 = about 1 s), 0 or less waits forever. The `yield`
 * gives back whether the condition came true.
 */
export function until(condition: () => boolean, timeout = 10, interval = 100): Until {
    return { condition, timeout, interval };
}

interface Task {
    generator: Generator<TaskStep, unknown, boolean>;
    /** Don't step before this time (ms since 1970). */
    wakeAt: number;
    /** The condition being waited for, if any. */
    waiting?: Until;
    /** When `waiting` gives up (Infinity for no timeout). */
    deadline: number;
    /** What the next `yield` gives back. */
    resume: boolean;
}

export class CoreTasks {
    private readonly tasks = new Map<string, Task>();
    /** The task being stepped: its generator is running and can't be closed until it yields. */
    private current?: Task;

    /**
     * Starts `body` as the task `name`, replacing (cancelling) a task of that name. Its first step
     * runs on the next tick, as `Task.Run` returns before its body starts.
     */
    start(name: string, body: TaskBody): void {
        this.cancel(name);
        this.tasks.set(name, { generator: body(), wakeAt: 0, deadline: Infinity, resume: true });
        bot.handlers.register(HANDLER, TICK_MS, () => this.tick());
    }

    /** Whether the task `name` is still running (C#'s `task is { IsCompleted: false }`). */
    running(name: string): boolean {
        return this.tasks.has(name);
    }

    /** Ends the task `name`, running its `finally` blocks; false when it wasn't running. */
    cancel(name: string): boolean {
        const task = this.tasks.get(name);
        if (!task) return false;
        this.tasks.delete(name);
        // A task cancelling itself is closed by `step` once it yields.
        if (task !== this.current) this.close(name, task);
        return true;
    }

    /** Ends every task. */
    cancelAll(): void {
        for (const name of [...this.tasks.keys()]) this.cancel(name);
    }

    /** Steps every task that is due. Returns false (removing the timer) once none is left. */
    private tick(): boolean {
        for (const [name, task] of [...this.tasks]) {
            // A task cancelled or replaced by an earlier one this tick.
            if (this.tasks.get(name) !== task) continue;
            const now = Date.now();
            if (now < task.wakeAt) continue;
            if (task.waiting) {
                const met = task.waiting.condition();
                if (!met && now < task.deadline) {
                    task.wakeAt = now + task.waiting.interval;
                    continue;
                }
                task.waiting = undefined;
                task.resume = met;
            }
            this.step(name, task);
        }
        return this.tasks.size > 0;
    }

    private step(name: string, task: Task): void {
        let next: IteratorResult<TaskStep, unknown>;
        this.current = task;
        try {
            next = task.generator.next(task.resume);
        } catch (error) {
            rethrowIfStopped(error);
            if (this.tasks.get(name) === task) this.tasks.delete(name);
            bot.log(`Task "${name}" failed: ${error instanceof Error ? error.message : String(error)}`);
            return;
        } finally {
            this.current = undefined;
        }
        // The step cancelled or replaced its own task.
        if (this.tasks.get(name) !== task) {
            if (!next.done) this.close(name, task);
            return;
        }
        if (next.done) {
            this.tasks.delete(name);
            return;
        }
        const now = Date.now();
        const value = next.value;
        task.resume = true;
        if (typeof value === "number") {
            task.wakeAt = now + Math.max(0, value);
        } else if (value) {
            task.waiting = value;
            task.deadline = value.timeout > 0 ? now + value.timeout * value.interval : Infinity;
            task.wakeAt = now;
        } else {
            task.wakeAt = now;
        }
    }

    private close(name: string, task: Task): void {
        try {
            task.generator.return(undefined);
        } catch (error) {
            rethrowIfStopped(error);
            bot.log(`Task "${name}" failed while stopping: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

/** The script's tasks. */
export const tasks = new CoreTasks();

/** C#'s `CancellationToken`: a task reads it at each step and ends when it's set. */
export interface CancellationToken {
    readonly isCancellationRequested: boolean;
}

/**
 * C#'s `CancellationTokenSource`: `cancel()` sets its `token`, which the tasks given it check at
 * their next step (a task can also be ended at once with `tasks.cancel(name)`).
 */
export class CancellationTokenSource {
    private cancelled = false;
    readonly token: CancellationToken;

    constructor() {
        const source = this;
        this.token = {
            get isCancellationRequested(): boolean {
                return source.cancelled;
            },
        };
    }

    get isCancellationRequested(): boolean {
        return this.cancelled;
    }

    cancel(): void {
        this.cancelled = true;
    }
}

/** C#'s `CancellationToken.None` (`default`): never cancelled. */
export const noCancellation: CancellationToken = { isCancellationRequested: false };

/**
 * C#'s `ManualResetEvent`: a flag a task sets (`set()`) and the script waits for (`waitOne`).
 * Waiting runs the tasks (it sleeps with `bot.sleep`); don't wait for it inside a task, `yield
 * until(() => event.isSet)` there.
 */
export class ManualResetEvent {
    constructor(private signaled = false) {}

    get isSet(): boolean {
        return this.signaled;
    }

    set(): void {
        this.signaled = true;
    }

    reset(): void {
        this.signaled = false;
    }

    /** Waits until it's set, at most `timeoutMs` (-1: forever); false on a timeout. */
    waitOne(timeoutMs = -1): boolean {
        return bot.wait.forTrue(() => this.signaled, timeoutMs < 0 ? 0 : Math.max(1, Math.ceil(timeoutMs / 100)));
    }
}
