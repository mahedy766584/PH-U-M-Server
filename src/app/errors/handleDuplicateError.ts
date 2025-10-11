/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from './../interface/error';
const handleDuplicateError = (err: any): TGenericErrorResponse => {

    // Regex to extract the value inside "name": "..."
    const match = err.message.match(/dup key: { name: "(.*?)" }/);

    const extracted_message = match && match[1];

    const errorSources: TErrorSources = [{
        path: '',
        message: `${extracted_message}: is already exists`,
    }];

    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources
    };

};

export default handleDuplicateError;