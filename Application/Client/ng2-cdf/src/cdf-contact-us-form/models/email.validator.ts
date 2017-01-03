///ref:  http://www.elanderson.net/2016/05/angular-2-model-driven-validation/
 
export class EmailValidator 
{
    static email(control: any) 
	{
		const emailRegexp = /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/i;
 
        if (control.value !== "" && (control.value.length <= 5 || !emailRegexp.test(control.value))) 
		{
            return { "email": true };
        }
 
        return null;
    }
}