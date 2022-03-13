import { atom, useAtom } from "jotai";

export const currentTabIdAtom = atom<string>("0");

export const useCurrentTabId = () => useAtom(currentTabIdAtom);
