import './FormDemo.css';

import { EForm } from '../../components/forms/eForm';

import { FormProps } from '../../models/Forms';

export const FormDemo = (props: any) => {
   
   
    const formProps: FormProps = {
        formDef: {
            name: 'Đại Đẹp Trai'
        }
    };

    return (
        <EForm {...formProps} />
    );

}
