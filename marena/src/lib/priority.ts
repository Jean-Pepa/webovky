// Prioritní ("svítící") zpráva na nástěnce. Cílí se na všechny / role / konkrétní
// lidi a KAŽDÝ cílený ji musí sám odkliknout ("Beru na vědomí") — potvrzení se
// drží po jménech v post.prioritySeenBy, takže to sedí napříč zařízeními a autor
// vidí, kdo už četl.

import type { Year, Post } from "./types";
import { sameName } from "./names";

// Je zpráva prioritně „pro mě"? (cílení všichni / moje role / moje jméno; autor se nepočítá)
export function isPriorityFor(year: Year, post: Post, name: string): boolean {
  const pr = post.priority;
  if (!pr || sameName(post.author, name)) return false;
  if (pr.all) return true;
  const roles = year.members.find((m) => sameName(m.name, name))?.roleIds ?? [];
  if (pr.roles?.some((r) => roles.includes(r))) return true;
  if (pr.people?.some((n) => sameName(n, name))) return true;
  return false;
}

// Odklikl už dotyčný „Beru na vědomí"?
export function hasSeenPriority(post: Post, name: string): boolean {
  return (post.prioritySeenBy ?? []).some((n) => sameName(n, name));
}

// Všichni cílení lidé (schválení členové, bez autora) — pro autorův přehled „kdo četl".
export function priorityTargetNames(year: Year, post: Post): string[] {
  if (!post.priority) return [];
  return year.members
    .filter((m) => m.approved !== false && !sameName(m.name, post.author) && isPriorityFor(year, post, m.name))
    .map((m) => m.name);
}
