import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PostEntity } from "../entities/post.entity";

export interface IPostRepository {
  createPost(post: Partial<PostEntity>): Promise<PostEntity>;
  searchPosts(): Promise<PostEntity[] | null>;
  findPostById(id: string): Promise<PostEntity | null>;
  findPostsByUserId(user_id: string): Promise<PostEntity[] | null>;
  incrementNumLikes(id: string): Promise<void>;
  incrementNumComments(id: string): Promise<void>;
  incrementNumShares(id: string): Promise<void>;
}

@Injectable()
export class PostRepository implements IPostRepository {

  constructor(
    @InjectModel(PostEntity.name)
    private readonly postModel: Model<PostEntity>,
  ) { }
  
  searchPosts(): Promise<PostEntity[]> {
    return this.postModel.find({
      deleted_at: null
    }).exec();
  }

  createPost(post: Partial<PostEntity>): Promise<PostEntity> {
    
    // Generate id for the post
    const post_id = new Types.ObjectId()

    const created_post = new this.postModel({
      _id: post_id,
      id: post_id.toString(),
      user_id: post.user_id,
      content: post.content,
      attachment: post.attachment,
      created_at: new Date().getTime(),
      num_likes: 0,
      num_comments: 0,
      num_shares: 0,
      num_views: 0,
      deleted_at: null
    });

    return created_post.save();
  }
  findPostById(id: string): Promise<PostEntity> {
    return this.postModel.findOne({
      id,
      deleted_at: null
    }).exec();
  }
  findPostsByUserId(user_id: string): Promise<PostEntity[]> {
    return this.postModel.find({
      user_id,
      deleted_at: null
    }).exec();
  }

  updatePostById(id: string, post: Partial<PostEntity>): Promise<PostEntity> {
    const updated_post = this.postModel.findOneAndUpdate({
      id,
      deleted_at: null
    }, {
      content: post.content,
      attachment: post.attachment,
      num_likes: post.num_likes,
      num_comments: post.num_comments,
      num_shares: post.num_shares,
      num_views: post.num_views
    }, {
      new: true
    }).exec();

    return updated_post;
  }

  incrementNumLikes(id: string): Promise<void> {
    return this.postModel.findOneAndUpdate({
      id,
      deleted_at: null
    }, {
      $inc: { num_likes: 1 }
    }).exec() as any;
  }

  incrementNumComments(id: string): Promise<void> {
    return this.postModel.findOneAndUpdate({
      id,
      deleted_at: null
    }, {
      $inc: { num_comments: 1 }
    }).exec() as any;
  }

  incrementNumShares(id: string): Promise<void> {
    return this.postModel.findOneAndUpdate({
      id,
      deleted_at: null
    }, {
      $inc: { num_shares: 1 }
    }).exec() as any;
  }
}