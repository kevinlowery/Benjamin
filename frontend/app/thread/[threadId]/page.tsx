"use client";

import { UUID } from "crypto";
import { useEffect } from "react";

import { AddBrainModal } from "@/lib/components/AddBrainModal";
import { useBrainCreationContext } from "@/lib/components/AddBrainModal/brainCreation-provider";
import PageHeader from "@/lib/components/PageHeader/PageHeader";
import { UploadDocumentModal } from "@/lib/components/UploadDocumentModal/UploadDocumentModal";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { useThreadContext } from "@/lib/context/ThreadProvider";
import { useDevice } from "@/lib/hooks/useDevice";
import { useCustomDropzone } from "@/lib/hooks/useDropzone";
import { ButtonType } from "@/lib/types/QuivrButton";
import { cn } from "@/lib/utils";

import { ActionsBar } from "./components/ActionsBar";
import Sources from "./components/Sources/Sources";
import { ThreadDialogueArea } from "./components/ThreadDialogueArea/ThreadDialogue";
import { useThreadNotificationsSync } from "./hooks/useThreadNotificationSync";
import styles from "./page.module.scss";

const SelectedThreadPage = (): JSX.Element => {
  const { getRootProps } = useCustomDropzone();
  const { isMobile } = useDevice();

  const { setShouldDisplayFeedCard, shouldDisplayFeedCard } =
    useKnowledgeToFeedContext();
  const { setIsBrainCreationModalOpened } = useBrainCreationContext();

  const { currentBrain, setCurrentBrainId } = useBrainContext();
  const { messages } = useThreadContext();
  const { sourcesMessageIndex, setSourcesMessageIndex } = useThreadContext();

  useThreadNotificationsSync();

  const buttons: ButtonType[] = [
    {
      label: "Create brain",
      color: "primary",
      onClick: () => {
        setIsBrainCreationModalOpened(true);
      },
      iconName: "brain",
    },
    {
      label: "Add knowledge",
      color: "primary",
      onClick: () => {
        setShouldDisplayFeedCard(true);
      },
      iconName: "uploadFile",
      hidden: !currentBrain?.max_files,
    },
    {
      label: "Manage current brain",
      color: "primary",
      onClick: () => {
        window.location.href = `/studio/${currentBrain?.id}`;
      },
      iconName: "edit",
    },
  ];

  useEffect(() => {
    if (!currentBrain && messages.length > 0) {
      setCurrentBrainId(messages[messages.length - 1].brain_id as UUID);
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      setSourcesMessageIndex(undefined);
    };
  }, []);

  return (
    <div className={styles.main_container}>
      <div className={styles.page_header}>
        <PageHeader iconName="thread" label="Thread" buttons={buttons} />
      </div>
      <div
        className={styles.thread_page_container}
        {...(shouldDisplayFeedCard ? {} : getRootProps())}
      >
        <div
          className={cn(
            "flex flex-col flex-1 items-center justify-stretch w-full h-full overflow-hidden",
            "dark:bg-black transition-colors ease-out duration-500"
          )}
        >
          <div
            className={`flex flex-col flex-1 w-full max-w-4xl h-full dark:shadow-primary/25 overflow-hidden`}
          >
            <div className="flex flex-1 flex-col overflow-y-auto">
              <ThreadDialogueArea />
            </div>
            <ActionsBar />
          </div>
        </div>
        {!isMobile && sourcesMessageIndex !== undefined && (
          <div className={styles.sources_wrapper}>
            <Sources />
          </div>
        )}
        <UploadDocumentModal />
        <AddBrainModal />
      </div>
    </div>
  );
};

export default SelectedThreadPage;
