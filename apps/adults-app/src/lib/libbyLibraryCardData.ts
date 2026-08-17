export interface LibraryBranch {
  id: string;
  librarySystemName: string;
  cardBarcode: string;
  isLinkedWithLibby: boolean;
  loansActiveCount: number;
  holdsAvailableCount: number;
}

export const DEFAULT_LIBRARY_BRANCHES: LibraryBranch[] = [
  {
    id: 'lib_nypl',
    librarySystemName: 'New York Public Library (NYPL)',
    cardBarcode: '2884900192841',
    isLinkedWithLibby: true,
    loansActiveCount: 3,
    holdsAvailableCount: 1
  },
  {
    id: 'lib_bpl',
    librarySystemName: 'Boston Public Library',
    cardBarcode: '2093849102938',
    isLinkedWithLibby: true,
    loansActiveCount: 1,
    holdsAvailableCount: 0
  }
];
