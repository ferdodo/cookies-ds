import { Mutex } from "async-mutex";

const animationLock = new Mutex();

export async function acquireAnimationLock() {
	const release = await animationLock.acquire();

	return function releaseAnimationLock() {
		release();
	};
}
