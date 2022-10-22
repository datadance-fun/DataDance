import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import cx from "classnames";
import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IconButton } from "../Compact/Button";
import { Button as NormalButton } from "../Button";
import {
  ChatBubbleIcon,
  Cross1Icon,
  EyeOpenIcon,
  Pencil2Icon,
  StackIcon,
} from "@radix-ui/react-icons";
import { Step } from "../Step";
import { useQuery } from "react-query";
import { DefaultClient } from "@/services/client";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { DataTable } from "../DataTable";
import { SQLCode } from "../SQLCode";
import { useControllableValue, useMemoizedFn } from "ahooks";
import { DatasetsList200ResponseInner, DataSource } from "@/api";

interface IDataSetPageProps {
  dataSet?: DatasetsList200ResponseInner;
  onDataSetChange?: (v?: DatasetsList200ResponseInner) => void;
}

function DataSetPage(props: IDataSetPageProps) {
  const { data: datasetLists } = useQuery("datasetlist", () =>
    DefaultClient.API.datasetsList()
  );

  const handleValueChange = useMemoizedFn((name) => {
    for (const dataSet of datasetLists?.data ?? []) {
      if (dataSet.name === name) {
        props.onDataSetChange?.(dataSet);
        return;
      }
    }
    // Unknown name
    props.onDataSetChange?.(undefined);
  });

  return (
    <RadioGroupPrimitive.Root
      value={props.dataSet?.name}
      onValueChange={handleValueChange}
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-4 gap-y-4 my-2">
        {(datasetLists?.data ?? []).map((dataset) => (
          <RadioGroupPrimitive.Item
            key={dataset.name}
            value={dataset.name}
            className="h-full bg-gray-100 bg-opacity-75 px-8 rounded overflow-hidden text-center relative hover:ring ring-rose-200 radix-state-checked:ring radix-state-checked:ring-rose-400 focus-ring"
          >
            <div className="my-8">
              <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                {dataset.info.category}
              </h2>
              <h1 className="title-font text-xl font-medium text-gray-900 mb-3">
                {dataset.info.name}
              </h1>
              <p className="leading-relaxed text-sm line-clamp-3">
                {dataset.info.description}
              </p>
            </div>
            <div className="text-center leading-none flex justify-center bottom-0 left-0 w-full my-4 text-xs">
              <span className="text-gray-400 mr-3 inline-flex items-center leading-none pr-3 py-1 border-r-2 border-gray-200">
                <StackIcon className="mr-1" /> 5 notebooks
              </span>
              <span className="text-gray-400 mr-3 inline-flex items-center leading-none pr-3 py-1 border-r-2 border-gray-200">
                <EyeOpenIcon className="mr-1" /> 1.2K
              </span>
              <span className="text-gray-400 inline-flex items-center leading-none">
                <ChatBubbleIcon className="mr-1" /> 6
              </span>
            </div>
            <RadioGroupPrimitive.Indicator className="absolute right-4 top-4 flex">
              <CheckCircleIcon className="h-6 w-6 text-rose-500" />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  );
}

interface IPreviewDataSetPageProps {
  dataSet?: DatasetsList200ResponseInner;
}

function PreviewDataSetPage({ dataSet }: IPreviewDataSetPageProps) {
  const { data, isLoading } = useQuery(
    ["dataPreview", dataSet?.name ?? "", ""],
    () =>
      DefaultClient.API.dataPreview({
        data_source: { dataset_id: dataSet?.name },
      }),
    {
      enabled: Boolean(dataSet?.name),
    }
  );

  return <DataTable data={data?.data} isLoading={isLoading} />;
}

interface IQueryPageProps {
  dataSet?: DatasetsList200ResponseInner;
  value?: string;
  onChange?: (v: string) => void;
}

function QueryPage(props: IQueryPageProps) {
  return (
    <>
      <div className="text-sm">
        <p>
          You can write customized SQL query to further transform your data.
        </p>
        <p>Current dataset: {props.dataSet?.info?.name}</p>
        <p>Current dataset FQN: {props.dataSet?.name}</p>
      </div>
      <SQLCode
        value={props.value}
        onChange={props.onChange}
        className="mt-4 rounded border border-slate-200 flex-1 min-h-0 overflow-auto"
      />
    </>
  );
}

interface IPreviewResultPageProps {
  dataSet?: DatasetsList200ResponseInner;
  query?: string;
}

function PreviewResultPage({ dataSet, query }: IPreviewResultPageProps) {
  const { data, isLoading } = useQuery(
    ["dataPreview", dataSet?.name ?? "", query ?? ""],
    () => {
      return DefaultClient.API.dataPreview({
        data_source: { dataset_id: dataSet?.name, query },
      });
    },
    {
      enabled: Boolean(dataSet || query),
    }
  );

  return <DataTable data={data?.data} isLoading={isLoading} />;
}

function DialogContent(props: IDataSourceSelectProps) {
  const [state, setState] = useControllableValue<
    IDataSourceSelectValue | undefined
  >(props);

  // below are unsaved states
  const [dataSet, setDataSet] = useState<DatasetsList200ResponseInner>();
  const [query, setQuery] = useState<string>();

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setDataSet(state?.srcDataSet);
    setQuery(state?.dataSource.query);
  }, [state]);

  const handleSetDataset = useMemoizedFn(
    (dataSet?: DatasetsList200ResponseInner) => {
      setDataSet(dataSet);
      setQuery("");
    }
  );

  const handleUpdateQuery = useMemoizedFn((query: string) => {
    setQuery(query);
  });

  const handleSave = useMemoizedFn(() => {
    if (!dataSet) {
      setState(undefined);
    } else {
      setState({
        dataSource: {
          dataset_id: dataSet?.name,
          query,
        },
        srcDataSet: dataSet,
      });
    }
  });

  return (
    <div className="flex-1 flex flex-col items-stretch max-w-full">
      <DialogPrimitive.Title className="font-medium text-gray-900 mb-4 px-8">
        Data Source
      </DialogPrimitive.Title>
      <div className="mb-4 px-8">
        <Step
          data={[
            { id: "Step 1", name: "Choose Data Set" },
            {
              id: "Step 2",
              name: "Preview",
            },
            {
              id: "Step 3",
              name: "Advanced Transform",
            },
            {
              id: "Step 4",
              name: "Result",
            },
          ]}
          value={currentStep}
          onChange={setCurrentStep}
        />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-8 flex flex-col">
        {currentStep === 0 && (
          <DataSetPage dataSet={dataSet} onDataSetChange={handleSetDataset} />
        )}
        {currentStep === 1 && <PreviewDataSetPage dataSet={dataSet} />}
        {currentStep === 2 && (
          <QueryPage
            dataSet={dataSet}
            value={query}
            onChange={handleUpdateQuery}
          />
        )}
        {currentStep === 3 && (
          <PreviewResultPage dataSet={dataSet} query={query} />
        )}
      </div>
      <div className="mt-4 flex justify-end px-8">
        <DialogPrimitive.Close asChild>
          <NormalButton
            type="primary"
            disabled={!dataSet && !query}
            onClick={handleSave}
          >
            Save
          </NormalButton>
        </DialogPrimitive.Close>
      </div>
    </div>
  );
}

export interface IDataSourceSelectValue {
  dataSource: DataSource;
  srcDataSet: DatasetsList200ResponseInner;
}

export interface IDataSourceSelectProps {
  value?: IDataSourceSelectValue;
  onChange?: (v: IDataSourceSelectValue) => void;
}

export function DataSourceSelect(props: IDataSourceSelectProps) {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <IconButton type="default">
          <Pencil2Icon />
        </IconButton>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal forceMount>
        <Transition.Root className="absolute" show={isOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogPrimitive.Overlay
              forceMount
              className="fixed inset-0 z-20"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, rgb(198, 212, 249), rgb(249, 216, 231))",
              }}
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPrimitive.Content
              forceMount
              className={cx(
                "fixed z-50",
                "left-8 right-8 top-20 bottom-8 rounded-lg py-8 shadow-lg flex",
                "bg-white"
              )}
            >
              <DialogContent {...props} />
              <DialogPrimitive.Close
                className={cx(
                  "absolute top-8 right-8 inline-flex items-center justify-center rounded-full p-1 focus-ring"
                )}
              >
                <Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </DialogPrimitive.Close>
            </DialogPrimitive.Content>
          </Transition.Child>
        </Transition.Root>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
