import { Key, Truck } from "phosphor-react-native";
import { Container, IconBox, Message, TextHighLight } from "./styles";
import { TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  loadIdentify?: string | null;
}

export const LoadStatus = ({ loadIdentify = null, ...rest }: Props) => {
  const Icon = loadIdentify ? Truck : Key;
  const message = loadIdentify ? `Load ${loadIdentify} in transit. ` : `No load in transit. `;
  const status = loadIdentify ? `delivery` : `departure. `;
  
  return (
    <Container {...rest}>
      <IconBox>
        <Icon size={32} color="#3e6fb7"/>
      </IconBox>

      <Message>
        {message}

        <TextHighLight>
          Click here to confirm {status}
        </TextHighLight>
      </Message> 
      
    </Container>
  );
};