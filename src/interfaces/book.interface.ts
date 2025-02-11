export interface Book {
  bookId?: string;
  title: string;
  subtitle?: string;
  isbn13: string;
  isbn10?: string;
  oclc?: string;
  olid?: string;
  asin?: string;
  lccn?: string;
  authors?: string[];
  publishers?: string[];
  published?: string;
  edition?: string;
  volumn?: string;
  country?: string;
  thumbnail?: string;
  dimensions?: string;
  language?: string;
  notes?: string;
  pages?: number;
  createdOn?: Date;
  updatedOn?: string;
}
