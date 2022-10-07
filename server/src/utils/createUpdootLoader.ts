import DataLoader from 'dataloader';
import { Updoot } from '../entities/Updoot';

// [{postId: 4, userId: 2}]
// [{postId: 4, userId: 2, value: 1}]
export const createUpdootLoader = () =>
  new DataLoader<
    { postId: number; userId: number },
    Updoot | null
  >(async (keys) => {
    const updoots = await Updoot.findByIds(keys as any);
    // findBy({ keys } as any) did not work, debug;
    // findByIds(keys as any); is deprecated
    const updootIdsToUpdoot: Record<string, Updoot> = {};
    updoots.forEach((updoot) => {
      updootIdsToUpdoot[
        `${updoot.userId}|${updoot.postId}`
      ] = updoot;
    });

    return keys.map(
      (key) =>
        updootIdsToUpdoot[`${key.userId}|${key.postId}`]
    );
  });
