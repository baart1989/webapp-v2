import { Image } from 'components/image/Image';
import { Token } from 'services/observables/tokens';
import { useAppSelector } from 'redux/index';
import { LineChartSimple } from 'components/charts/LineChartSimple';
import { LineData } from 'lightweight-charts';
import { prettifyNumber } from 'utils/helperFunctions';
import { ReactComponent as IconProtected } from 'assets/icons/protected.svg';
import { useMemo } from 'react';
import { SortingRule } from 'react-table';
import { DataTable, TableColumn } from 'components/table/DataTable';

const sampleData: LineData[] = [
  { time: '2019-04-11', value: 80.01 },
  { time: '2019-04-12', value: 96.63 },
  { time: '2019-04-13', value: 76.64 },
  { time: '2019-04-14', value: 81.89 },
  { time: '2019-04-15', value: 74.43 },
  { time: '2019-04-16', value: 80.01 },
  { time: '2019-04-17', value: 96.63 },
  { time: '2019-04-18', value: 76.64 },
  { time: '2019-04-19', value: 81.89 },
  { time: '2019-04-20', value: 74.43 },
  { time: '2019-04-21', value: 80.01 },
  { time: '2019-04-22', value: 96.63 },
  { time: '2019-04-23', value: 76.64 },
  { time: '2019-04-24', value: 81.89 },
  { time: '2019-04-25', value: 74.43 },
  { time: '2019-04-26', value: 80.01 },
  { time: '2019-04-27', value: 96.63 },
  { time: '2019-04-28', value: 76.64 },
  { time: '2019-04-29', value: 81.89 },
  { time: '2019-04-30', value: 74.43 },
];

export const PoolsTable = () => {
  const tokens = useAppSelector<Token[]>((state) => state.bancor.tokens);
  const data = useMemo<Token[]>(() => tokens, [tokens]);

  const CellName = (token: Token) => {
    return (
      <div className={'flex items-center'}>
        <Image
          src={token.logoURI}
          alt="Token"
          className="bg-grey-2 rounded-full h-30 w-30 mr-10"
        />
        <div>
          <h3>{token.symbol}</h3>
          <span className="text-12 text-grey-3">{token.name}</span>
        </div>
      </div>
    );
  };

  const columns = useMemo<TableColumn<Token>[]>(
    () => [
      {
        id: '1',
        Header: 'Protected',
        accessor: () => <IconProtected className="w-18 h-20 text-primary" />,
        width: 120,
        minWidth: 120,
        tooltip: 'Some awesome text here',
      },
      {
        id: '2',
        Header: 'Name',
        accessor: 'symbol',
        Cell: (cellData) => CellName(cellData.row.original),
        tooltip: 'Some awesome text here',
        minWidth: 180,
      },
      {
        id: '3',
        Header: 'Price',
        accessor: 'usdPrice',
        Cell: (cellData) => prettifyNumber(cellData.value ?? 0, true),
        tooltip: 'Some awesome text here',
        minWidth: 110,
      },
      {
        id: '4',
        Header: '24h Change',
        accessor: () => '+12.34%',
        tooltip: 'Some awesome text here',
        minWidth: 110,
      },
      {
        id: '5',
        Header: '24h Volume',
        accessor: () => '$12,123,123',
        tooltip: 'Some awesome text here',
        minWidth: 120,
      },
      {
        id: '6',
        Header: 'Liquidity',
        accessor: () => '$450,123,123',
        tooltip: 'Some awesome text here',
        minWidth: 150,
      },
      {
        id: '7',
        Header: 'Last 7 Days',
        accessor: () => <LineChartSimple data={sampleData} color="#0ED3B0" />,
        tooltip: 'Some awesome text here',
        minWidth: 170,
        disableSortBy: true,
      },
      {
        id: '8',
        Header: '',
        accessor: () => (
          <button className="btn-primary btn-sm rounded-[12px]">Trade</button>
        ),
        width: 50,
        minWidth: 50,
        disableSortBy: true,
      },
    ],
    []
  );

  const defaultSort: SortingRule<Token> = { id: '3', desc: true };

  return (
    <section className="content-section pt-20 pb-10">
      <h2 className="ml-20 mb-20">Pools</h2>

      <DataTable<Token>
        data={data}
        columns={columns}
        defaultSort={defaultSort}
        isLoading={!tokens.length}
      />
    </section>
  );
};
