import * as React from 'react';
import {ModelInfo} from './ModelInfo';
import {shallow, ShallowWrapper} from 'enzyme';
import {MlMetadataArtifact} from '../apis/service';

describe('ModelInfo', () => {
  let tree: ShallowWrapper;
  let model: MlMetadataArtifact;

  const consoleErrorSpy = jest.spyOn(console, 'error')
    .mockImplementation(() => null);

  beforeEach(() => {
    model = {
      id: '1',
      type_id: '1',
      uri: 'gs://my-bucket/mnist',
      properties: {
        name: {string_value: 'test model'},
        description: {string_value: 'A really great model'},
        version: {string_value: 'v1'},
        create_time: {string_value: '2019-06-12T01:21:48.259263Z'},
        __ALL_META__: {
          string_value: '{"hyperparameters": {"early_stop": true, ' +
            '"layers": [10, 3, 1], "learning_rate": 0.5}, ' +
            '"model_type": "neural network", ' +
            '"training_framework": {"name": "tensorflow", "version": "v1.0"}}'
        }
      },
      custom_properties: {
        __kf_workspace__: {string_value: 'workspace-1'},
        __kf_run__: {string_value: '1'},
      },
    };
  })

  afterEach(() => tree.unmount());

  it('Renders Model information', () => {
    tree = shallow(<ModelInfo model={model} />);

    expect(tree).toMatchSnapshot();
  });

  it('Renders Model information with missing __ALL_META__ property', () => {
    delete model.properties!.__ALL_META__;

    tree = shallow(<ModelInfo model={model} />);

    expect(tree).toMatchSnapshot();
  });

  it('Renders Model information with malformed __ALL_META__ property', () => {
    model.properties!.__ALL_META__!.string_value = 'non-JSON string';

    tree = shallow(<ModelInfo model={model} />);

    expect(tree).toMatchSnapshot();
    expect(consoleErrorSpy.mock.calls[0][0]).toBe(
      'Unable to parse __ALL_META__ property');
  });
});
