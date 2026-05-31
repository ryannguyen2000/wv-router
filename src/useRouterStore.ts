import { create } from "zustand";

export interface RouteEntry {
  name: string;
  params: Record<string, unknown>;
}

interface RouterStore {
  stack: RouteEntry[];
  action: "PUSH" | "POP" | "IDLE" | "REPLACE"; // Thêm REPLACE
  push: (pageName: string, params?: Record<string, unknown>) => void;
  replace: (pageName: string, params?: Record<string, unknown>) => void; // Khai báo hàm mới
  pop: () => void;
  popFromNative: () => void;
  currentRoute: () => RouteEntry;
}

export const useRouterStore = create<RouterStore>((set, get) => ({
  stack: [{ name: "home", params: {} }],
  action: "IDLE",

  currentRoute: () => {
    const stack = get().stack;
    return stack[stack.length - 1];
  },

  push: (pageName, params = {}) => {
    window.history.pushState({ pageName }, "", `#${pageName}`);
    set((state) => ({
      stack: [...state.stack, { name: pageName, params }],
      action: "PUSH",
    }));
  },

  pop: () => {
    // KHÔNG sửa state ở đây! Chỉ lùi history.
    // Trình duyệt sẽ tự bắn event 'popstate', useNativeBack sẽ hứng và gọi popFromNative.
    window.history.back();
  },

  replace: (pageName, params = {}) => {
    // Dùng replaceState của trình duyệt để không sinh thêm rác lịch sử
    window.history.replaceState({ pageName }, "", `#${pageName}`);
    set((state) => {
      // Copy stack hiện tại
      const newStack = [...state.stack];
      // Ghi đè phần tử cuối cùng (trang hiện tại) thành trang mới
      newStack[newStack.length - 1] = { name: pageName, params };
      return {
        stack: newStack,
        action: "REPLACE",
      };
    });
  },

  popFromNative: () => {
    set((state) => {
      if (state.stack.length <= 1) return state;
      return {
        stack: state.stack.slice(0, -1),
        action: "POP",
      };
    });
  },
}));
