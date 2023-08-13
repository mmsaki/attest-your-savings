"use client";

import { Menu, Transition } from "@headlessui/react";
import Icon from "../../Icon";
import { useAccount, useConnect, useDisconnect } from "wagmi";

type CreateProps = {};

const Create = ({}: CreateProps) => {
  const {
    connector: activeConnector,
    isConnected,
    isReconnecting,
    isConnecting,
  } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("connected", { address, connector, isReconnected });
    },
    onDisconnect() {
      console.log("Disconnected");
    },
  });
  const {
    connect,
    connectors,
    error: connectError,
    isLoading: connectLoading,
    pendingConnector,
  } = useConnect({
    onError(error) {
      console.error("Error ->", error);
    },
    onMutate(connector) {
      console.log("Before connect ->", connector);
    },
    onSettled(data, error) {
      console.log("Settled ->", { data, error });
    },
    onSuccess(data) {
      console.log("Connect ->", data);
    },
  });
  console.log("Connectors", { activeConnector }, connectors[0]);

  const { disconnect } = useDisconnect({
    onError(error) {
      console.log("Error ->", error);
    },
    onMutate() {
      console.log("Intiating ->");
    },
    onSettled(data, error) {
      console.log("Settled ->", { data, error });
    },
    onSuccess(data) {
      console.log("Disconnected ->", data);
    },
  });

  return (
    <Menu className="relative md:hidden" as="div">
      <Menu.Button className="btn-purple btn-medium px-5 md:!bg-transparent md:border-none md:w-6 md:h-6 md:p-0 md:text-0">
        <Icon className="md:!m-0" name="add-circle" />
        <span>Connect Wallet</span>
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute top-full right-0 w-[16.69rem] mt-2.5 py-2 border border-n-1 rounded-sm bg-white shadow-primary-4 dark:bg-n-1 dark:border-white">
          {connectors.map((connector) => (
            <Menu.Item
              className="flex items-center w-full h-10 mb-1.5 px-6.5 text-sm font-bold last:mb-0 transition-colors hover:bg-n-3/10 dark:hover:bg-white/20"
              key={connector.id}
              as="button"
              onClick={() => connect({ connector: connector })}
              disabled={
                !connector.ready ||
                isReconnecting ||
                connector.id === activeConnector?.id
              }
            >
              {activeConnector?.id === connector.id
                ? connector.name + " 🟢 "
                : connector.name}
              {connectLoading &&
                pendingConnector?.id === connector.id &&
                " (connecting)"}
            </Menu.Item>
          ))}
          {connectError && (
            <div className="text-red-600 flex items-center w-full h-10 mb-1.5 px-6.5 text-sm font-bold last:mb-0 transition-colors hover:bg-n-3/10 dark:hover:bg-white/20">
              {connectError.message}
            </div>
          )}
          {isConnected && (
            <div>
              <Menu.Item
                as="button"
                onClick={() => disconnect()}
                className="flex items-center w-full h-10 mb-1.5 px-6.5 text-sm font-bold last:mb-0 transition-colors hover:bg-n-3/10 dark:hover:bg-white/20"
              >
                Disconnect
              </Menu.Item>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Create;
