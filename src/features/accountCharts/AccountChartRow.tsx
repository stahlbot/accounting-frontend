import { useAppSelector } from "../../app/hooks";
import { selectAccountChartById } from "./accountChartsSlice";

export default function AccountChartRow({ id, children }) {
  const accountChart = useAppSelector((state) =>
    selectAccountChartById(state, id)
  )!;

  return (
    <tr key={id}>
      {children}
      <td>{accountChart.name}</td>
      <td>{accountChart.isTemplate ? "Yes" : "No"}</td>
    </tr>
  );
}
