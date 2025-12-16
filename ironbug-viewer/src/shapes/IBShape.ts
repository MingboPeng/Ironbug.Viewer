import { Box, createShapeId, Vec } from "tldraw";


export class IBShape {
    bound: Box;
    leftAnchor: Vec;
    rightAnchor: Vec;
    ibType?: string;
    ibObj: any;


    constructor (bound: Box, leftAnchor: Vec, rightAnchor: Vec) {
        this.bound = bound;
        this.leftAnchor = leftAnchor;
        this.rightAnchor = rightAnchor;
    }

    // // To TLShape
    // toTLShape() {
    //       const imageUrl = GetImage(ibType);
    //       const shape = {
    //         id: createShapeId(_currentLoopId + trackingId),
    //         type: "ibshape",
    //         x: x,
    //         y: y,
    //         props: {
    //           w: this.bound.w,
    //           h: this.bound.h,
    //           url: imageUrl,
    //           ostype: ibType,
    //           name: name,
    //         },
    //       }as TLShape;
    // }

}
