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
    icon: "dots",
    url: "/modal",
    onclick: () => console.log("Click on dots"),
  },
];
