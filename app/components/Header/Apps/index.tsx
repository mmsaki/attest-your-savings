"use client";

import { Menu, Transition } from "@headlessui/react";
import Icon from "../../Icon";

// import { apps } from "@/mocks/apps";
import { useNetwork, useSwitchNetwork } from "wagmi";

type AppsProps = {};

const Apps = ({}: AppsProps) => {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork, status } =
    useSwitchNetwork({
      onError(error) {
        console.error("Error ->", error);
      },
      onMutate(args) {
        console.log("Changing network ->", args);
      },
      onSettled(data, error) {
        console.log("Settled ->", { data, error });
      },
      onSuccess(data) {
        console.log("Success ->", data);
      },
    });
  console.log("chains", chains);
  return (
    <Menu className="relative mr-7 md:hidden" as="div">
      <Menu.Button className="btn-transparent-dark btn-medium ui-open:text-purple-1 ui-open:fill-purple-1">
        <Icon className="-mt-0.25" name="puzzle" />
        <span>Chains</span>
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute top-full -right-[9.8rem] w-[24.25rem] mt-2.5 border border-n-1 rounded-sm bg-white shadow-primary-4 dark:bg-n-1 dark:border-white">
          <div className="flex flex-wrap justify-between px-7 py-4">
            {chains.map((link) => (
              <Menu.Item
                className="flex flex-col justify-center items-center w-[5.25rem] h-[5.25rem] text-sm font-bold rounded-sm transition-colors hover:bg-purple-1/20 dark:hover:bg-white/20"
                key={link.id}
                as="button"
                // href={link.href}
                // target="_blank"
                disabled={!switchNetwork || link.id === chain?.id}
                onClick={() => switchNetwork?.(link.id)}
                rel="noopener noreferrer"
              >
                <Icon
                  className="icon-28 mb-2.5 dark:fill-white"
                  name={link.network}
                />
                {chain?.network === link.network
                  ? link.name + " 🟢 "
                  : link.name}
                {isLoading && pendingChainId === link.id && " (switching)"}
              </Menu.Item>
            ))}
          </div>
          {chain && (
            <>
              <button className="w-full h-13 border-t border-n-1 text-base font-bold transition-colors hover:text-purple-1 dark:border-white">
                Connected to {chain.name}
                {" (ChainId " + chain.id + ")"}
              </button>
              <div>{error && (error?.message ?? "Failed to switch")}</div>
            </>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Apps;
