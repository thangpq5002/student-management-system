import { useEffect, useState } from "react";
import { classService, ClassOption } from "../services/class.service";

export function useClassOptions() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    classService.getClassOptions()
      .then((items) => {
        if (active) setClasses(items);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setClasses([]);
          setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách lớp.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { classes, isLoading, error };
}
