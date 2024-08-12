import { IndexInfoDto } from 'src/modules/browser/redisearch/dto';

export const mockIndexInfoRaw = [
  'index_name',
  'idx:movie',
  'index_options',
  [],
  'index_definition',
  ['key_type', 'HASH', 'prefixes', ['movie:'], 'default_score', '1'],
  'attributes',
  [
    ['identifier', 'title', 'attribute', 'title', 'type', 'TEXT', 'WEIGHT', '1', 'SORTABLE'],
    ['identifier', 'release_year', 'attribute', 'release_year', 'type', 'NUMERIC', 'SORTABLE', 'UNF'],
    ['identifier', 'rating', 'attribute', 'rating', 'type', 'NUMERIC', 'SORTABLE', 'UNF'],
    ['identifier', 'genre', 'attribute', 'genre', 'type', 'TAG', 'SEPARATOR', ',', 'SORTABLE'],
  ],
  'num_docs',
  '2',
  'max_doc_id',
  '2',
  'num_terms',
  '13',
  'num_records',
  '19',
  'inverted_sz_mb',
  '0.0016384124755859375',
  'vector_index_sz_mb',
  '0',
  'total_inverted_index_blocks',
  '17',
  'offset_vectors_sz_mb',
  '1.239776611328125e-5',
  'doc_table_size_mb',
  '1.468658447265625e-4',
  'sortable_values_size_mb',
  '2.498626708984375e-4',
  'key_table_size_mb',
  '8.296966552734375e-5',
  'tag_overhead_sz_mb',
  '5.53131103515625e-5',
  'text_overhead_sz_mb',
  '4.3392181396484375e-4',
  'total_index_memory_sz_mb',
  '0.0026903152465820313',
  'geoshapes_sz_mb', '0',
  'records_per_doc_avg',
  '9.5',
  'bytes_per_record_avg',
  '90.42105102539063',
  'offsets_per_term_avg',
  '0.6842105388641357',
  'offset_bits_per_record_avg',
  '8', 'hash_indexing_failures',
  '0', 'total_indexing_time', '0.890999972820282', 'indexing', '0',
  'percent_indexed', '1', 'number_of_uses', 17, 'cleaning', 0, 'gc_stats',
  ['bytes_collected', '0', 'total_ms_run', '0', 'total_cycles', '0',
    'average_cycle_time_ms', 'nan', 'last_run_time_ms', '0',
    'gc_numeric_trees_missed', '0', 'gc_blocks_denied', '0',
  ],
  'cursor_stats',
  ['global_idle', 0, 'global_total', 0, 'index_capacity', 128, 'index_total', 0],
  'dialect_stats',
  ['dialect_1', 1, 'dialect_2', 0, 'dialect_3', 0, 'dialect_4', 0],
  'Index Errors',
  ['indexing failures', 0, 'last indexing error', 'N/A', 'last indexing error key', 'N/A'],
  'field statistics',
  [
    ['identifier', 'title', 'attribute', 'title', 'Index Errors',
      ['indexing failures', 0, 'last indexing error', 'N/A', 'last indexing error key', 'N/A'],
    ],
    ['identifier', 'release_year', 'attribute', 'release_year', 'Index Errors',
      ['indexing failures', 0, 'last indexing error', 'N/A', 'last indexing error key', 'N/A'],
    ],
    ['identifier', 'rating', 'attribute', 'rating', 'Index Errors',
      ['indexing failures', 0, 'last indexing error', 'N/A', 'last indexing error key', 'N/A'],
    ],
    ['identifier', 'genre', 'attribute', 'genre', 'Index Errors',
      ['indexing failures', 0, 'last indexing error', 'N/A', 'last indexing error key', 'N/A'],
    ]]];

export const mockIndexInfoDto: IndexInfoDto = {
  index_name: 'idx:movie',
  index_options: {},
  index_definition: { key_type: 'HASH', prefixes: ['movie:'], default_score: '1' },
  attributes: [
    {
      identifier: 'title',
      attribute: 'title',
      type: 'TEXT',
      WEIGHT: '1',
      SORTABLE: true,
      NOINDEX: undefined,
      CASESENSITIVE: undefined,
      UNF: undefined,
      NOSTEM: undefined,
    },
    {
      identifier: 'release_year',
      attribute: 'release_year',
      type: 'NUMERIC',
      SORTABLE: true,
      NOINDEX: undefined,
      CASESENSITIVE: undefined,
      UNF: true,
      NOSTEM: undefined,
    },
    {
      identifier: 'rating',
      attribute: 'rating',
      type: 'NUMERIC',
      SORTABLE: true,
      NOINDEX: undefined,
      CASESENSITIVE: undefined,
      UNF: true,
      NOSTEM: undefined,
    },
    {
      identifier: 'genre',
      attribute: 'genre',
      type: 'TAG',
      SEPARATOR: ',',
      SORTABLE: true,
      NOINDEX: undefined,
      CASESENSITIVE: undefined,
      UNF: undefined,
      NOSTEM: undefined,
    },
  ],
  num_docs: '2',
  max_doc_id: '2',
  num_terms: '13',
  num_records: '19',
  inverted_sz_mb: '0.0016384124755859375',
  vector_index_sz_mb: '0',
  total_inverted_index_blocks: '17',
  offset_vectors_sz_mb: '1.239776611328125e-5',
  doc_table_size_mb: '1.468658447265625e-4',
  sortable_values_size_mb: '2.498626708984375e-4',
  tag_overhead_sz_mb: '5.53131103515625e-5',
  text_overhead_sz_mb: '4.3392181396484375e-4',
  total_index_memory_sz_mb: '0.0026903152465820313',

  key_table_size_mb: '8.296966552734375e-5',
  geoshapes_sz_mb: '0',
  records_per_doc_avg: '9.5',
  bytes_per_record_avg: '90.42105102539063',
  offsets_per_term_avg: '0.6842105388641357',
  offset_bits_per_record_avg: '8',
  hash_indexing_failures: '0',
  total_indexing_time: '0.890999972820282',
  indexing: '0',
  percent_indexed: '1',
  number_of_uses: 17,
  cleaning: 0,
  gc_stats: {
    bytes_collected: '0',
    total_ms_run: '0',
    total_cycles: '0',
    average_cycle_time_ms: 'nan',
    last_run_time_ms: '0',
    gc_numeric_trees_missed: '0',
    gc_blocks_denied: '0',
  },
  cursor_stats: {
    global_idle: 0,
    global_total: 0,
    index_capacity: 128,
    index_total: 0,
  },
  dialect_stats: {
    dialect_1: 1, dialect_2: 0, dialect_3: 0, dialect_4: 0,
  },
  'Index Errors': {
    'indexing failures': 0,
    'last indexing error': 'N/A',
    'last indexing error key': 'N/A',
  },
  'field statistics': [
    {
      identifier: 'title',
      attribute: 'title',
      'Index Errors': {
        'indexing failures': 0,
        'last indexing error': 'N/A',
        'last indexing error key': 'N/A',
      },
    },
    {
      identifier: 'release_year',
      attribute: 'release_year',
      'Index Errors': {
        'indexing failures': 0,
        'last indexing error': 'N/A',
        'last indexing error key': 'N/A',
      },
    },
    {
      identifier: 'rating',
      attribute: 'rating',
      'Index Errors': {
        'indexing failures': 0,
        'last indexing error': 'N/A',
        'last indexing error key': 'N/A',
      },
    },
    {
      identifier: 'genre',
      attribute: 'genre',
      'Index Errors': {
        'indexing failures': 0,
        'last indexing error': 'N/A',
        'last indexing error key': 'N/A',
      },
    },
  ],
};