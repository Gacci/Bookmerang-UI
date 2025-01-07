export enum State  {
    NEW         = 'NEW',
    LIKE_NEW    = 'LIKE NEW',
    VERY_GOOD   = 'VERY GOOD',
    GOOD        = 'GOOD',
    ACCEPTABLE  =  'ACCEPTABLE'
}

export enum Binding {
    BROKEN  = 'BROKEN', 
    DAMAGED = 'DAMAGED',
    INTACT  = 'INTACT', 
    WEAK    = 'WEAK'
}

export enum Cover {
    CREASED     = 'CREASED',
    CUT         = 'CUT',
    DISCOLORED  = 'DISCOLORED',
    FADED       = 'FADED',
    INTACT      = 'INTACT',
    RIPPED      = 'RIPPED',
    SCRATCHED   = 'SCRATCHED',
    STAINED     = 'STAINED'
}
export enum Pages {
    CREASED     = 'CREASED',
    FOLDED      = 'FOLDED',
    INTACT      = 'INTACT',
    MARKED      = 'MARKED',
    STAINED     = 'STAINED',
    TORN        = 'TORN',
    WARPED      = 'WARPED',
    YELLOWED    = 'YELLOWED'
}
export enum Markings {
    EXTENSIVE   = 'EXTENSIVE',
    HIGHLIGHTER = 'HIGHLIGHTER',
    MINIMAL     = 'MINIMAL', 
    NONE        = 'NONE',
    PEN         = 'PEN', 
    PENCIL      = 'PENCIL'
}
export enum Extras {
    ACCESS_CODE = 'ACCESS_CODE',
    CD           = 'CD'
}