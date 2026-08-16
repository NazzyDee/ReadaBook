export interface CanonDispute {
  id: string;
  disputedClaim: string;
  bookSource: string;
  proCanonVotes: number;
  antiCanonVotes: number;
  tribunalVerdict: 'VERIFIED_CANON' | 'HERESY_APOCRYPHA' | 'IN_DELIBERATION';
  primaryCitation: string;
}

export const DEFAULT_CANON_DISPUTES: CanonDispute[] = [
  {
    id: 'disp_balrog_wings',
    disputedClaim: 'Do Balrogs of Morgoth possess physical wings of flight?',
    bookSource: 'The Fellowship of the Ring (Moria Chapters)',
    proCanonVotes: 1420,
    antiCanonVotes: 890,
    tribunalVerdict: 'IN_DELIBERATION',
    primaryCitation: '"His enemy stood still again, facing him, and the shadow about it reached out like two vast wings."'
  },
  {
    id: 'disp_arwen_swords',
    disputedClaim: 'Did Arwen rescue Frodo at the Ford of Bruinen in the original 1954 text?',
    bookSource: 'The Fellowship of the Ring, Book 1, Chapter 12',
    proCanonVotes: 120,
    antiCanonVotes: 2310,
    tribunalVerdict: 'HERESY_APOCRYPHA',
    primaryCitation: 'Glorfindel the Elf-lord rescued Frodo upon Asfaloth; Arwen did not participate in the journey.'
  }
];
