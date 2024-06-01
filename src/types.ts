export interface Auther {
  _id: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  genre: string;
  coverImage: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  auther: Auther;
}
