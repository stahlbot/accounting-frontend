import { useAppSelector } from "../../app/hooks";
import { selectCategoryById } from "./categoriesSlice";

export function CategoryRow({ id, children }) {
  console.log(id);
  const category = useAppSelector((state) => selectCategoryById(state, id))!;
  console.log(category!);

  return (
    <tr key={id}>
      {children}
      <td>{category.name}</td>
      <td>{category.document}</td>
    </tr>
  );
}
