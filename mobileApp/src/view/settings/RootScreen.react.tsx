import {View} from 'react-native';
import {Link} from '@react-navigation/native';
export default (): JSX.Element => (
  <View>
    <Link to={{screen: 'Upload'}}>upload</Link>
  </View>
);
