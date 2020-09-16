import { Maybe } from "./shared.types";

export type ArticlesState = {
  currentArticleList?: ArticleViewModelList;
  currentArticle?: Maybe<ArticleViewModel>;
  currentFeed: ArticleFeed;
};

export enum ArticleFeed {
  User,
  Followed,
  Global,
  Tag,
  Favorited
}

export type ArticleDto = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: AuthorDto;
};

export type ArticleViewModel = {
  article: ArticleDto;
};

export type AuthorDto = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export type ArticleViewModelList = {
  articles: ArticleDto[];
  articlesCount: number;
};

export type CommentViewModel = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: AuthorDto;
};

export type CommentViewModelList = {
  comments: CommentViewModel[];
};

export type Tag = {
  tags: string[];
};