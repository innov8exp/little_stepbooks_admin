import { create } from "zustand";
export const useStore = create((set) => ({
  userInfo: { email: "111", password: "222" },
  updateUserInfo: (userInfo) => set(() => ({ userInfo: userInfo })),
  getUserInfo: () =>
    set((state) =>
      console.log(state, "===更新前===")
      // userInfo: {
      //   ...state.userInfo,
      //   email: state.email,
      //   password: state.password,
      // },
    ),
}));

// function Counter() {
//   const { count, inc } = useStore();
//   return (
//     <div>
//       <span>{count}</span>
//       <button onClick={inc}>one up</button>
//     </div>
//   );
// }
