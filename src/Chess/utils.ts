import { Chess, Color, Piece, PieceSymbol, Square } from "chess.js";

export const findPiece = (game: Chess, piece: Piece) => {
  return game
    .board()
    .flat()
    .filter((p): p is { square: Square; type: PieceSymbol; color: Color } => p !== null)
    .find((p) => p.color === piece.color && p.type === piece.type);
};
