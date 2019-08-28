import { FaceMatcher } from '../../../src/globalApi/FaceMatcher';
import { LabeledFaceDescriptors } from '../../../src';

describe('globalApi', () => {

  describe('FaceMatcher', () => {

    const json = '{"_distanceThreshold":123.321,"_labeledDescriptors":[{"_label":"foo","_descriptors":[{"0":1,"1":2,"2":3},{"0":4,"1":5,"2":6}]},{"_label":"bar","_descriptors":[{"0":7,"1":8,"2":9},{"0":3,"1":2,"2":1}]}]}';
    const dt = 123.321;
    const l1 = 'foo';
    const l2 = 'bar';
    const f1 = new Float32Array([1, 2, 3]);
    const f2 = new Float32Array([4, 5, 6]);
    const f3 = new Float32Array([7, 8, 9]);
    const f4 = new Float32Array([3, 2, 1]);
    const lds = [
      new LabeledFaceDescriptors(l1, [f1, f2]),
      new LabeledFaceDescriptors(l2, [f3, f4])
    ];

    it('fromJSON()', () => {
      const fm = FaceMatcher.fromJSON(json);

      expect(fm.distanceThreshold).toBe(dt);
      expect(fm.labeledDescriptors.length).toBe(2);
      expect(fm.labeledDescriptors[0].label).toBe(l1);
      expect(fm.labeledDescriptors[0].descriptors.length).toBe(2);
      expect(fm.labeledDescriptors[0].descriptors[0]).toEqual(f1);
      expect(fm.labeledDescriptors[0].descriptors[1]).toEqual(f2);
      expect(fm.labeledDescriptors[1].label).toBe(l2);
      expect(fm.labeledDescriptors[1].descriptors.length).toBe(2);
      expect(fm.labeledDescriptors[1].descriptors[0]).toEqual(f3);
      expect(fm.labeledDescriptors[1].descriptors[1]).toEqual(f4);
    });

    it('toJSON() => fromJSON()', () => {
      const fm = FaceMatcher.fromJSON(JSON.stringify(new FaceMatcher(lds, dt)));

      expect(fm.distanceThreshold).toBe(dt);
      expect(fm.labeledDescriptors.length).toBe(2);
      expect(fm.labeledDescriptors[0].label).toBe(l1);
      expect(fm.labeledDescriptors[0].descriptors.length).toBe(2);
      expect(fm.labeledDescriptors[0].descriptors[0]).toEqual(f1);
      expect(fm.labeledDescriptors[0].descriptors[1]).toEqual(f2);
      expect(fm.labeledDescriptors[1].label).toBe(l2);
      expect(fm.labeledDescriptors[1].descriptors.length).toBe(2);
      expect(fm.labeledDescriptors[1].descriptors[0]).toEqual(f3);
      expect(fm.labeledDescriptors[1].descriptors[1]).toEqual(f4);
    });

  });

});