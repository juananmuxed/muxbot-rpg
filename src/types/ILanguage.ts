export interface IString {
  [key: string]: string;
}

export interface DefaultModule {
  strings: IString;
  commands: IString;
}

export interface LanguageModule {
  default: DefaultModule;
}
