import React, { useState } from "react";
import {
    Wrapper,
    WindowTitle,
    CloseWindowButton,
    DraggableHandle,
    TitleBars,
    TitleBar,
    WindowTitleText,
    WindowContent,
} from "./styles";
import Draggable from "react-draggable";

/**
 * @param background
 * @param border
 * @param width
 * @param height
 * @param closable
 * @param draggable
 * @param x
 * @param y
 *
 * @returns React component
 */
function Window(props: any) {
    const { closed, setClosed, draggable, closable, title } = props;

    return (
        <Draggable handle="strong">
            <Wrapper style={{ display: !closed ? 'block' : 'none' }} {...props}>
                <WindowTitle draggable={draggable} closable={closable}>
                    {closable ? (
                        <CloseWindowButton
                            onClick={() => setClosed(true)}
                            className="pointer"
                        >
                            <p>+</p>
                        </CloseWindowButton>
                    ) : null}
                    <DraggableHandle>
                        <TitleBars>
                            <TitleBar></TitleBar>
                            <TitleBar></TitleBar>
                        </TitleBars>
                        <WindowTitleText>{title}</WindowTitleText>
                    </DraggableHandle>
                </WindowTitle>
                <WindowContent>
                    {React.Children.map(props.children, (element: any) => {
                        return React.cloneElement(element, {
                            setClosed: setClosed,
                        });
                    })}
                </WindowContent>
            </Wrapper>
        </Draggable>
    );
}

export default Window;
