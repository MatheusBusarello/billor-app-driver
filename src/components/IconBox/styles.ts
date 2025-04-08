import styled, { css } from "styled-components/native";
import theme from "../../theme";

export type SizeProps = 'sm' | 'md';

type Props = {
  size: SizeProps;
}

const variantSizesStyles = (size: SizeProps) => {
  return {
    sm: css`
      width: 32px;
      height: 32px;
    `,
    md: css`
      width: 46px;
      height: 46px;
    `,
  }[size];
}

export const Container = styled.View<Props>`
  border-radius: 6px;
  background-color: ${theme.COLORS.GRAY_700};

  justify-content: center;
  align-items: center;
  
  margin-right: 12px;

  ${({ size }) => variantSizesStyles(size)}
`;