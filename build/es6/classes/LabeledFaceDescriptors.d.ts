export declare class LabeledFaceDescriptors {
    private _label;
    private _descriptors;
    constructor(label: string, descriptors: Float32Array[]);
    readonly label: string;
    readonly descriptors: Float32Array[];
    static fromJSON(jsonString: string): LabeledFaceDescriptors;
    static fromPOJO(pojo: any): LabeledFaceDescriptors;
}
