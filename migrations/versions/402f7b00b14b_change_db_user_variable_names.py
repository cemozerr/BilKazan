"""change db user variable names

Revision ID: 402f7b00b14b
Revises: 4d7fd42403d4
Create Date: 2018-02-09 14:12:20.912246

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '402f7b00b14b'
down_revision = '4d7fd42403d4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('phonenumber', sa.String(length=64), nullable=True))
        batch_op.create_index(batch_op.f('ix_user_phonenumber'), ['phonenumber'], unique=True)
        batch_op.drop_index('ix_user_phoneNum')
        batch_op.drop_column('phoneNum')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('phoneNum', sa.VARCHAR(length=64), nullable=True))
        batch_op.create_index('ix_user_phoneNum', ['phoneNum'], unique=1)
        batch_op.drop_index(batch_op.f('ix_user_phonenumber'))
        batch_op.drop_column('phonenumber')

    # ### end Alembic commands ###
