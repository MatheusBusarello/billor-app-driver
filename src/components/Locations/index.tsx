import { Truck, FlagCheckered } from 'phosphor-react-native'

import { LocationInfo, LocationInfoProps } from '../LocationInfo'
import { Container, Line } from './styles'

type Props = {
  departure: LocationInfoProps;
  delivery?: LocationInfoProps | null;
}

export function Locations({ departure, delivery = null }: Props) {
  return (
    <Container>
      <LocationInfo 
        icon={Truck}
        label={departure.label}
        description={departure.description}
      />
  
      {
        delivery &&
        <>
          <Line />
    
          <LocationInfo 
            icon={FlagCheckered}
            label={delivery.label}
            description={delivery.description}
          />
        </>
      }
    </Container>
  )
}