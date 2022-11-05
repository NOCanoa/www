
import React, { useEffect, useRef, useState } from "react";
import { matchPath, Link, useLocation } from "react-router-dom";
import { Links, Blog, Link as NavLink, Wrapper, GoBackHome, BlogTitle, BlogDate, BlogWrapper, SectionTitle, HighlightElement } from "./style";
import { motion } from "framer-motion";
import { BLOG_NAV_WIDTH } from "../../../../const";
import { useNavigate, useNavigation } from "react-router-dom";
import blogs from "../../../../blogs";

import gsap from "gsap";
import offset from "document-offset";

import {MDXProvider} from '@mdx-js/react'

import snippets from "../../../../snippets";
import code from "./md/core/code";

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
    delay: 1.2,
};

const pageVariants = {
    initial: {
        transform: `translateX(-${BLOG_NAV_WIDTH})`,
        transition: pageTransition
    },
    in: {
        filter: 'blur(0px)',
        transform: `translateX(0px)`,
        opacity: '1',
        transition: pageTransition
    },
    out: {
        filter: 'blur(15px)',
        transform: `translateX(-${BLOG_NAV_WIDTH})`,
        transition: {
            type: "tween",
            ease: "anticipate",
            duration: 0.5,
            delay: 0,
        }
    }
};

const blogVariants = {
    initial: {
        filter: 'blur(10px)',
        transform: 'translate(-80px, 5px)',
        opacity: '0'
    },
    in: {
        filter: 'blur(0px)',
        transform: 'translate(0px, 0px)',
        opacity: '1'
    },
    out: {
        filter: 'blur(10px)',
        transform: 'translate(-80px, 5px)',
        opacity: '0'
    }
};

const blogTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

export default function() {
    const navigate = useNavigate();

    let [id, setId] = useState(0);
    let [isSnippet, setIfSnippet] = useState(false);
    let highlightElement = useRef(null);

    const arrLength = blogs.length + snippets.length;
    const refs = useRef([] as any);

    const addToRefs = (el: any) => {
        if (el && !refs.current.includes(el)) {
          refs.current.push(el);
        }
    };

    useEffect(() => {
        if (refs.current.length == arrLength) {
            gsap.config({ force3D: 'auto' })

            refs.current.map((el: any, i: number) => {
                el.addEventListener('mouseenter', (e: any) => {
                    gsap.killTweensOf(highlightElement.current)
                    let el_offset = offset(el);

                    if (refs.current.includes(e.relatedTarget) === true) {
                        gsap.set(highlightElement.current, { opacity: 1, height: el.offsetHeight - 2 })

                        gsap.to(
                            highlightElement.current,
                                {
                                    width: el.offsetWidth,
                                    y: el_offset.top,
                                    x: el_offset.left,
                                    duration: 0.1
                                }
                        )
        
                        return;
                    }


                    gsap.set(
                        highlightElement.current,
                        {
                            opacity: 1,
                            width: el.offsetWidth,
                            height: el.offsetHeight - 2,
                            y: el_offset.top,
                            x: el_offset.left,
                        }
                    )

                })

                el.addEventListener('mouseleave', (_: any) => {
                    gsap.to(highlightElement.current, { opacity: 0, duration: 0.1 })
                })
            })
        }
    }, [refs])

    const ifMatch = (cmp: number) => {
        return id == cmp;
    }

    const replace_id = (el: any) => {
        if (typeof el == "string") {
            return el.replace(/\W/g , '-').toLowerCase()
        }

        return "";
    }

    const blog_props = {
        components: {
            code,
            h1: (props: any) => (<section id={replace_id(props.children)}><h1>{props.children}</h1></section>),
            h2: (props: any) => (<section id={replace_id(props.children)}><h2>{props.children}</h2></section>),
            h3: (props: any) => (<section id={replace_id(props.children)}><h3>{props.children}</h3></section>),
            h4: (props: any) => (<section id={replace_id(props.children)}><h4>{props.children}</h4></section>),
        },
    }

    return (
        <div style={{ overflowY: 'hidden', display: 'flex', width: '100%' }}>

            <Wrapper
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                key="blog-left-nav">
                <GoBackHome onClick={() => {
                    (navigate(-1) || navigate("/"))
                }}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    <span>Go Back</span>
                </GoBackHome>
                <Links>
                    <HighlightElement ref={highlightElement}></HighlightElement>

                    {blogs.map((data: any, i) => (
                        <NavLink ref={addToRefs} onClick={() => {setIfSnippet(false); setId(i+1)}} className={(ifMatch(i+1) && (!isSnippet)) ? "active" : ""}>
                            <BlogTitle>{data.meta.name}</BlogTitle>
                            <BlogDate>
                                {data.meta.date}
                                {data.meta.tag && (
                                    <>
                                        <span style={{ margin: '0 5px' }}>—</span>{data.meta.tag}
                                    </>
                                )}
                            </BlogDate>
                        </NavLink>
                    ))}
                </Links>
                <SectionTitle>Code Snippets</SectionTitle>
                <Links>
                    {snippets.map((data: any, i) => (
                        <NavLink ref={addToRefs} onClick={() => {setIfSnippet(true); setId(i+1)}} className={(ifMatch(i+1) && isSnippet) ? "active" : ""}>
                            <BlogTitle>{data.meta.name}</BlogTitle>
                            <BlogDate>
                                {data.meta.date}
                                {data.meta.tag && (
                                    <>
                                        <span style={{ margin: '0 5px' }}>—</span>{data.meta.tag}
                                    </>
                                )}
                            </BlogDate>
                        </NavLink>
                    ))}
                </Links>
                {/* TODO: snippets */}
            </Wrapper>
            <BlogWrapper>
                {id != 0 ? (
                    <Blog
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={blogVariants}
                        transition={blogTransition}
                        key={isSnippet ? id + blogs.length : id }>
                        <GoBackHome style={{ transform: 'translateY(15px)' }} onClick={() => setId(0)}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            <span>Close {isSnippet ? "Snippet" : "Article"}</span>
                        </GoBackHome>
                        {isSnippet && (<br/>)}
                        <MDXProvider>
                            {isSnippet ? snippets[id-1].default(blog_props) : blogs[id-1].default(blog_props)}
                        </MDXProvider>
                    </Blog>
                ) : null}
            </BlogWrapper>
        </div>
    )
}
