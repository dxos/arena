//
// Copyright 2020 DXOS.org
//

export const memberSorter = (a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : a.isMe ? -1 : 1);
