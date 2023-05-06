export function useFormRules() {
  return {
    ruleRequired: (v: any) => !!v || "Поле обязательно",
    ruleEmail: (value: any) => {
      const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value) || "Введите корректный Email";
    },
    rulePassLen: (v: string) =>
      (!!v && v.length >= 6) || "Пароль должен содержать минимум 6 символов",
      ruleNameLen: (v: string) =>
      (!!v && v.length >= 3) || "Название должно содержать минимум 3 символа",
    rulePhone: (value: any) => {
      const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      return pattern.test(value) || "Введите корректный номер";
    },
  };
}
