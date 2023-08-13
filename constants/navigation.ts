export const navigation = [
  {
    title: "My Safe",
    icons: "dashboard",
    counter: 16,
    url: "/my-safe",
  },
  {
    title: "Attestations",
    icons: "projects",
    url: "/my-attestations",
  },
  {
    title: "Tasks",
    icon: "tasks",
    url: "/my-tasks",
  },
  {
    title: "Transactions",
    icons: "layers",
    url: "/my-transactions",
  },
  {
    title: "Calendar",
    icon: "calendar",
    url: "/my-calendar",
  },
  {
    title: "Inbox",
    icon: "email",
    url: "/my-inbox",
  },
];

export const mobileNavigation = [
  {
    icon: "My Safe",
    url: "/my-safe",
  },
  {
    icon: "attestations",
    url: "/my-attestations",
  },
  {
    icon: "tasks",
    url: "/my-tasks",
  },
  {
    icon: "layers",
    url: "/my-transactions",
  },
  {
    icon: "dots",
    url: "/modal",
    onclick: () => console.log("Click on dots"),
  },
];
