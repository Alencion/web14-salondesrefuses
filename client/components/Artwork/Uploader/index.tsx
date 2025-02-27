import React, { RefObject, useRef } from 'react';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';

// import Tiles from '../Tiles';
import CSuspense from '@components/common/Suspense';
import Fallback from '@components/common/Fallback';
import useToast from '@hooks/useToast';
import ErrorBoundary from '@components/common/ErrorBoundary';

const Tiles = dynamic(() => import('@components/Artwork/Tiles'), { ssr: false });

interface UploaderProps {
    handleNewImage: (image: File) => void;
}

const Uploader = ({ handleNewImage }: UploaderProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const showToast = useToast({
        onSuccess: '',
        onFailed: '파일 용량은 3MB를 초과할 수 없습니다.',
    });

    const onClickFileInput = (e: React.MouseEvent) => {
        e.stopPropagation();
        inputRef.current!.click();
    };

    const onChangeFile = (e: React.FormEvent) => {
        if (!validFileInput(inputRef)) return;
        const newFile = inputRef.current!.files![0];
        if (byteToMB(newFile.size) > 3) {
            showToast('failed');
            inputRef.current!.value = '';
            return;
        }
        handleNewImage(newFile);
    };

    return (
        <Container>
            <FileInput onClick={onClickFileInput}>
                <input type="file" name="newArtwork" ref={inputRef} onChange={onChangeFile} />
                <img src="/icons/add.png" alt="add" />
            </FileInput>
            <ErrorBoundary fallback={<div>...failed</div>}>
                <CSuspense fallback={<Fallback />}>
                    <Tiles align="center" />
                </CSuspense>
            </ErrorBoundary>
        </Container>
    );
};

const validFileInput = (ref: RefObject<HTMLInputElement | null>) => {
    if (!ref.current || !ref.current.files || ref.current.files.length === 0) return false;
    return true;
};

const byteToMB = (byte: number) => Math.ceil(byte / 1024 / 1024);

const Container = styled.div`
    width: 80%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 45px;
`;

const FileInput = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 1000px;
    height: 100px;
    border: 1px dashed black;
    margin-bottom: 20px;
    cursor: pointer;

    & > input {
        position: absolute;
        visibility: hidden;
    }

    & img {
        width: 64px;
        height: 64px;
    }
`;

export default Uploader;
