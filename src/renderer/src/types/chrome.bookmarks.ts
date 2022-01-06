export type ChromeBookMarksNodeItem = {
  url?: string;
  logo: string;
  desc: string;
  title?: string;
};

export type ChromeBookMarksNode = {
  name: string;
  uuid: number;
  children: [];
  // web 没有归类的零散的
  web: [];
};
