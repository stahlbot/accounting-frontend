import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectClientById } from "../clients/clientsSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectAccountIdsSortedBy,
  selectClientAccountsSortedBy,
} from "../accounts/accountsSlice";
import { useForm } from "@mantine/form";
import { addBooking, selectBookingById } from "./bookingsSlice";
import {
  Button,
  Card,
  Grid,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { format, formatISO, parseISO } from "date-fns";

interface Props {
  bookingEditedId?: string;
}

export default function BookingForm({ bookingEditedId }: Props) {
  // General Stuff
  const dispatch = useAppDispatch();

  // client Stuff
  const clientId = useParams().clientId!;
  const client = useAppSelector((state) => selectClientById(state, clientId));

  // account stuff
  const accountChartId = client?.accountChart;
  const [sortBy, setSortBy] = useState<string>("number");
  const accounts = useSelector((state) =>
    selectClientAccountsSortedBy(state, {
      sortBy: sortBy,
      accountChartId,
    })
  );
  const accountSelectData = accounts.map((account) => {
    return {
      value: account.id,
      label: `${account.number} ${account.name}`,
    };
  });

  // Edit Booking Stuff
  const bookingEdited = useAppSelector((state) =>
    selectBookingById(state, bookingEditedId!)
  );

  //   console.log(bookingEdited);

  // Form Stuff
  let form;
  let submit;
  if (!bookingEdited) {
    const initialValues = {
      value: "",
      credit: "",
      invoiceNr: "",
      date: new Date(),
      debit: "",
      text: "",
    };
    // console.log(initialValues);
    form = useForm({
      initialValues: initialValues,
    });
    // console.log(form.values);
    submit = form.onSubmit(
      async ({ value, credit, invoiceNr, date, debit, text }) => {
        if (!bookingEditedId) {
          await dispatch(
            addBooking({
              value,
              credit,
              invoiceNr,
              date: format(date, "yyyy-MM-dd"),
              debit,
              text,
              client: clientId,
              isCommited: false,
            })
          );
        }
      }
    );
  } else {
    const initialValues = {
      ...bookingEdited,
      date: new Date(bookingEdited.date),
    };
    // console.log(initialValues);
    form = useForm({
      initialValues: initialValues,
    });
    // console.log(form.values);

    // console.log(form.values);
    submit = form.onSubmit(() => {
      console.log("save edit");
    });
  }

  // I don't know why I have to use this hacky solution but otherwise the form wouldn't update its state to the edited booking
  useEffect(() => {
    if (bookingEdited) {
      const initialValues = {
        ...bookingEdited,
        date: new Date(bookingEdited.date),
      };
      form.setValues(initialValues);
    }
  }, [bookingEditedId]);

  return (
    <form onSubmit={submit}>
      <Card shadow="lg" padding={"lg"} withBorder radius="md">
        <Grid justify="center" align="flex-end">
          <Grid.Col span={2}>
            <NumberInput
              placeholder=""
              label="Value"
              precision={2}
              hideControls
              //   required
              {...form.getInputProps("value")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Select
              label="Credit"
              data={accountSelectData}
              searchable
              //   required
              {...form.getInputProps("credit")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <TextInput
              placeholder=""
              label="Invoice Nr."
              //   required
              {...form.getInputProps("invoiceNr")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <DateInput
              valueFormat="DD.MM.YYYY"
              dateParser={(input) => {
                return parseISO(input);
              }}
              label="Date"
              //   required
              {...form.getInputProps("date")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <Select
              label="Debit"
              data={accountSelectData}
              searchable
              //   required
              {...form.getInputProps("debit")}
            />
          </Grid.Col>

          <Grid.Col span={8}>
            <TextInput
              placeholder=""
              label="Text"
              //   required
              {...form.getInputProps("text")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <Button type="submit" mt={"md"} fullWidth>
              Save
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </form>
  );
}
