declare module "joi" {
    export type Schema = unknown;

    export interface NumberSchema extends Schema {
        default(value: number): NumberSchema;
        required(): NumberSchema;
    }

    export interface StringSchema extends Schema {
        default(value: string): StringSchema;
        required(): StringSchema;
    }

    export interface ObjectSchema<T = any> extends Schema {}

    export function number(): NumberSchema;
    export function string(): StringSchema;
    export function object<T = any>(schema?: Record<string, any>): ObjectSchema<T>;

    const Joi: {
        number: typeof number;
        string: typeof string;
        object: typeof object;
    };

    export default Joi;
}
