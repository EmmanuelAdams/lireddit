import DataLoader from 'dataloader';
import { In } from 'typeorm';
import { Updoot } from '../entities/Updoot';

// [{postId: 4, userId: 2}]
// [{postId: 4, userId: 2, value: 1}]
export const createUpdootLoader = () =>
  new DataLoader<
    { postId: Number; userId: Number },
    Updoot | null
  >(async (idObjArr) => {
    const userIds = idObjArr.map((obj) => obj.userId);
    const postIds = idObjArr.map((obj) => obj.postId);
    const updoots = await Updoot.findBy({
      userId: In(userIds),
      postId: In(postIds),
    });

    const updootToIdMap: Record<string, Updoot> = {};
    updoots.forEach((updoot) => {
      updootToIdMap[`${updoot.userId}|${updoot.postId}`] =
        updoot;
    });

    return idObjArr.map((obj) => {
      return updootToIdMap[`${obj.userId}|${obj.postId}`];
    });
  });
