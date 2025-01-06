import { Binding, Cover, Extras, Markings, Pages, State } from "../enums/book-offer.enum";
import { Book } from "./book.interface";
import { User } from "./user";

export interface BookOffer {
    bookOfferId: number;
    userId: number;
    isbn13: string;
    notes?: string; 
    tradeable: boolean;
    price: number;
    state: State;
    binding: Binding;
    cover: Cover;
    pages: Pages;
    markings: Markings;
    extras: Extras;
    postedOn: Date;
    updatedOn: Date;

    userRefSavedBookOfferId: number | null;
    
    book: Book;
    user: User;
}

export interface BookOfferState {
    isProcessingLike: boolean;
}