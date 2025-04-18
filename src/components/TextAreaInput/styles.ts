import styled from "styled-components/native";
import theme from "../../theme";

export const Container = styled.View `
  width: 100%;
  height: 150px;
  padding: 16px;
  border-radius: 6px;

  background-color: ${theme.COLORS.GRAY_700};
`;

export const Label = styled.Text`
  font-size: ${theme.FONT_SIZE.SM}px;
  font-family: ${theme.FONT_FAMILY.REGULAR};
  color: ${theme.COLORS.GRAY_300};
`;

export const Input = styled.TextInput`
  font-size: ${theme.FONT_SIZE.SM}px;
  font-family: ${theme.FONT_FAMILY.REGULAR};
  color: ${theme.COLORS.GRAY_300};

  vertical-align: top;
  margin-top: 16px;
`;

