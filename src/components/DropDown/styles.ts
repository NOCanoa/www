
import styled from 'styled-components';

export const DropDownContainer = styled.div``;
export const DropDownHeader = styled.div``;
export const DropDownListContainer = styled.div`
    position: absolute;
    transform: translateY(10%);
    z-index: 9;
`;

export const DropDownList = styled.ul`
    margin: 0;
    padding: 0;
    border: 2px solid #1d1e1c;
    box-sizing: border-box;
    font-size: 1.1rem;
    font-weight: 500;
    background: #E8E7E2;
    position: relative;
    min-width: 10rem;
`;

export const ListItem = styled.li`
    list-style: none;
    width: calc(100% - 10px);
    padding: 5px;

    &:hover {
        background: #1d1e1c;
        color: #E8E7E2;
    }
`;