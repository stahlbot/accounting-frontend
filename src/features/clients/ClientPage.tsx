import { Tabs, Text } from "@mantine/core";

export const ClientPage = () => {
  return (
    <Tabs defaultValue="gallery">
      <Tabs.List>
        <Text>ClientName - </Text>
        <Text>Enterprise Selector - </Text>
        <Text>Year Selector: </Text>
        <Tabs.Tab value="bookinglist">Bookings</Tabs.Tab>
        <Tabs.Tab value="accountlist">Accounts</Tabs.Tab>
        <Tabs.Tab value="balance">Balance</Tabs.Tab>
        <Tabs.Tab value="profitloss">Profit and Loss</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="bookinglist" pt="xs">
        Booking tab content
      </Tabs.Panel>
      <Tabs.Panel value="accountlist" pt="xs">
        Account tab content
      </Tabs.Panel>
      <Tabs.Panel value="balance" pt="xs">
        Balance tab content
      </Tabs.Panel>
      <Tabs.Panel value="profitloss" pt="xs">
        Profit and Loss tab content
      </Tabs.Panel>
      <Tabs.Panel value="settings" pt="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
};
