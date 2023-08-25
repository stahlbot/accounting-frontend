import { useAppSelector } from "../../app/hooks";
import { selectCategoryById } from "./categoriesSlice";

export function CategoryRow({ id, children }) {
  const category = useAppSelector((state) => selectCategoryById(state, id))!;

  return (
    <tr key={id}>
      {children}
      <td>{category.name}</td>
      <td>{category.document}</td>
    </tr>
  );
}
